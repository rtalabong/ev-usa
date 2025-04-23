# ⚡ Electric Vehicle Charging in the United States

This is an interactive web map that visualizes the spatial distribution of electric vehicle (EV) charging infrastructure across the United States. It highlights where public and private chargers are densely concentrated and where EV “charging deserts” exist, with the goal of helping inform infrastructure planning and policy awareness.

Built using [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/), this project combines geospatial data with interactivity, including EV policy summaries and zoomable, responsive mapping behavior. This project was developed for the Web Mapping course at NYU, taught by Chris Whong.

---

## Features

| Feature | Description |
|--------|-------------|
| **EV Charger Visualization** | Over 130,000 EV charger locations visualized via `GeoJSON`, separated into public and private datasets |
| **Responsive Layout** | Fullscreen map layout with a scrollable sidebar and responsive design |
| **Hover + Click Interactions** | States highlight on hover and zoom into full detail on click |
| **EV Policy Summaries** | Each state displays a 3-paragraph summary of its EV policy when clicked, loaded from a local CSV |
| **Reset Button** | Restores the map’s default view and sidebar text |

---

## Technologies Used

- **Mapbox GL JS** – map rendering and interactivity
- **Turf.js** – spatial analysis (e.g., calculating bounding boxes on click)
- **PapaParse** – client-side CSV parsing for policy descriptions
- **HTML, CSS, JavaScript** – lightweight, no frontend framework

---

## Roadmap

| Planned Feature | Description |
|----------------|-------------|
| **3D Density Visualization** | Use vertical extrusions to show concentration of EV chargers |
| **State/City Labels** | Display intuitive labels with smart transparency to avoid overlap |
| **Charger Type Filter** | Add UI controls to toggle visibility of public/private chargers |
| **Choropleth Overlay** | Visualize EV registrations per state as a choropleth for deeper analysis |

---

## Data Sources

| Dataset | Description |
|---------|-------------|
| `public.geojson` / `private.geojson` | National dataset of public and private EV chargers | [U.S. Department of Energy – Alternative Fuels Data Center](https://afdc.energy.gov/) |
| `us-states.geojson` | U.S. state boundaries | U.S. Census / GeoJSON repositories |
| `ev-policies.csv` | State-level EV policy summaries | Manually compiled based on publicly available state-level documentation |
