mapboxgl.accessToken = 'pk.eyJ1IjoicmFtYm90YWxhYm9uZyIsImEiOiJjbHlxNG92MTMwNzY1MmlxMWVoc2lrOGo5In0.o9HtRcDTcxuLtwsxhD4_lA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-95.68034, 37.90618],
    zoom: 3.78,
    maxBounds: [
        [-190.61297, 22.87681],
        [-63.95012, 74.07440]
    ]
});

// PAGE SETUP
// Setting default sidebar content before any state is chosen
document.getElementById('sidebar').innerHTML = `
<div id="sidebar-text">
  <p>The electric vehicle transition is one of the biggest prerequisites for the United States to achieve its climate goals.</p>
  <p>To make that possible, there needs to be enough charging infrastructure so that drivers don't have to face anxiety over losing battery on the road.</p>
  <p>The map shows the concentration of public and private electric vehicle charging outlets, showing where there are robust charging infrastructure and where there are charging deserts.</p>
</div>


<div id="instruction-text">Click a state to learn about its EV policies.</div>

<div id="legend">
<div id="legend-color">
<div class="legend-item">
    <div class="legend-color" style="background-color: #FECD25;"></div>
    <span>Public chargers</span>
</div>
<div class="legend-item">
    <div class="legend-color" style="background-color: #17964C;"></div>
    <span>Private chargers</span>
</div>
</div>
</div>

`;



// DATA ACCESS

// State policy data
let policyData = {}; // Will store: { stateName: policyText }

Papa.parse('./data/ev-policies.csv', {
    header: true,
    download: true,
    complete: function (results) {
        results.data.forEach(row => {
            if (row.State && row.Policy) {
                policyData[row.State.trim()] = row.Policy.trim();
            }
        });
        // Check
        console.log("📄 Loaded policy data:", policyData);
    }
});

map.on('load', () => {

    // Add layer for US states
    map.addSource('states', {
        type: 'geojson',
        data: './data/us-states.geojson',
    });

    // Public EV chargers
    map.addSource('public', {
        type: 'geojson',
        data: './data/public.geojson',
    });


    // Private EV chargers
    map.addSource('private', {
        type: 'geojson',
        data: './data/private.geojson',
    });


    // VISUALIZATION

    // US states
    map.addLayer({
        id: 'state-fills',
        type: 'fill',
        source: 'states',
        paint: {
            'fill-color': 'light gray',
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.4, // Highlight opacity
                0    // Default is fully transparent
            ]
        }
    });

    // US states borders
    map.addLayer({
        id: 'state-borders',
        type: 'line',
        source: 'states',
        paint: {
            'line-color': 'light gray',
            'line-width': .5
        }
    });

    // Public EV chargers
    map.addLayer({
        id: 'circle-public',
        type: 'circle',
        source: 'public',
        paint: {
            'circle-radius': 2.2,
            'circle-color': '#FFC914', // Optional: bright orange for visibility
            'circle-opacity': 1,
            'circle-stroke-width': .5,
            'circle-stroke-color': '#fff'
        }
    });

    // Private EV chargers
    map.addLayer({
        id: 'circle-private',
        type: 'circle',
        source: 'private',
        paint: {
            'circle-radius': 2.2,
            'circle-color': '#058E3F', // Optional: bright blue for visibility
            'circle-opacity': 1,
            'circle-stroke-width': .5,
            'circle-stroke-color': '#fff'
        }
    });

    // INTERACTIVITY

    // Highlight state on hover
    let hoveredStateId = null;

    map.on('mousemove', 'state-fills', (e) => {
        if (e.features.length > 0) {
            // Remove the previous hover state
            if (hoveredStateId !== null) {
                map.setFeatureState(
                    { source: 'states', id: hoveredStateId },
                    { hover: false }
                );
            }

            hoveredStateId = e.features[0].id;

            // Set the new hover state
            map.setFeatureState(
                { source: 'states', id: hoveredStateId },
                { hover: true }
            );
        }
    });

    map.on('mouseleave', 'state-fills', () => {
        if (hoveredStateId !== null) {
            map.setFeatureState(
                { source: 'states', id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = null;
    });
});

// Zooming into click state
map.on('click', 'state-fills', (e) => {
    if (e.features.length > 0) {
        const feature = e.features[0];

        // 1. Calculate the bounding box of the clicked state
        const bounds = turf.bbox(feature); // [minX, minY, maxX, maxY]

        // 2. Fit the map to the bounding box with some padding
        map.fitBounds(bounds, {
            padding: 40, // px padding around the edges
            duration: 1500 // animation time in ms
        });

        // 3. Extract state name (adjust based on your property name)
        const stateName = feature.properties.name || feature.properties.STATE_NAME;

        // 4. Placeholder policy content (to be replaced later with CSV-based lookup)
        // Find policy for this state
        const policyText = policyData[stateName] || `
  <p>No policy information found for ${stateName}.</p>
  <p>Please check the CSV file or data formatting.</p>
`;
        // Wrap paragraphs if needed
        const formatted = `<p>${policyText.replace(/\n/g, '</p><p>')}</p>`;


        // 5. Inject placeholder text into the sidebar
        document.getElementById('sidebar').innerHTML = `
        <h2>${stateName}</h2>
        <div id="state-text">
          ${formatted}
        </div>

        <div id="legend">
<div id="legend-color">
<div class="legend-item">
    <div class="legend-color" style="background-color: #FECD25;"></div>
    <span>Public chargers</span>
</div>
<div class="legend-item">
    <div class="legend-color" style="background-color: #17964C;"></div>
    <span>Private chargers</span>
</div>
</div>
</div>

<button id="reset-view" style="margin-top: .5em; margin-left: 10px">Reset View</button>
      `;



        // 6. Add reset functionality
        document.getElementById('reset-view').addEventListener('click', () => {
            map.flyTo({
                center: [-97.73200, 37.75410],
                zoom: 3.75,
                speed: 1.2,
                curve: 1.4
            });

            // Restore original sidebar content
            document.getElementById('sidebar').innerHTML = `
            <div id="sidebar-text">
            <p>The electric vehicle transition is one of the biggest prerequisites for the United States to achieve its climate goals.</p>
            <p>To make that possible, there needs to be enough charging infrastructure so that drivers don't have to face anxiety over losing battery on the road.</p>
            <p>The map shows the concentration of public and private electric vehicle charging outlets, showing where there are robust charging infrastructure and where there are charging deserts.</p>
          </div>          
          
          <div id="instruction-text">Click a state to learn about its EV policies.</div>

          <div id="legend">
<div id="legend-color">
<div class="legend-item">
    <div class="legend-color" style="background-color: #FECD25;"></div>
    <span>Public chargers</span>
</div>
<div class="legend-item">
    <div class="legend-color" style="background-color: #17964C;"></div>
    <span>Private chargers</span>
</div>
</div>
</div>
            `;
        });
    }
});

map.addControl(new mapboxgl.NavigationControl());
