# SGI 2024/2025 - TP1

## Group: T04G08

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Rita Leite       | 202105309 | up202105309@up.pt  |
| Tiago Azevedo    | 202108699 | up202108699@up.pt  |

----
## Project information

### Strong points

- We have a wide variety of objects with different levels of complexity. Some of them are simple, while others are a grouping of several objects.

- We have several objects with surfaces or curved lines that do not belong to the group of mandatory objects. They are the curtains, the sofa, the cushions and the wall lamps.

- We use different types of lights.

  - SpotLight: used to represent sunlight as well as to represent lights coming from ceiling spotlights and wall lamps.

  - PointLight: used to represent the light coming from the lampshade.

  - RectAreaLight: used to illuminate the panorama.

### Scene description

- The scene shows a living and dining room setup.

- In the dining area, there's a table with two chairs. On the table we have a newspaper, a cake, a vase of flowers, and a small spiral spring. The living area has two sofas facing a coffee table, with a TV on a console nearby.

- Three frames decorate the walls: two portraits on the left wall and a car painting on the back wall. Two circular rugs, each with a unique texture, were also added to both the dining and living areas.

- Lighting includes three ceiling spotlights, a corner floor lamp, and three wall lamps above the frames. A spotlight simulates sunlight coming through a window, brightening the space naturally. We also added a rectangular area light facing the panorama to make it look brighter.

### Relative link to the scene

----
## Issues/Problems

- To represent a spiral spring we used a TubeGeometry, however this geometry does not allow us to create a "covered" tube. We tried adding two circles, one for each end, to serve as caps, but since the ends have a specific inclination, we were unable to place these caps perfectly. Because of this, we chose to place the caps vertically anyway, knowing that it is visible that there is a space between the cap and the end of the tube.