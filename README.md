# Langton's Ant 3D - Three.js :ant:

## Test it out!

:arrow_forward: [Live Demo](https://xlacasa.github.io/Langton_Ant_3D/) :arrow_backward:

#### Some cool patterns to try:
* RLLR
* RRRLLRRR
* RLR
* LRRRRRRLLR
* RRLLLRLRLRRL
* RRLLLRLLLRRR

## Screenshots

![screenshot1](readme_media/screenshot1.png)

## Inspiration

Just look at [this video](https://www.youtube.com/watch?v=1X-gtr4pEBU) :video_camera:. I mean, who wouldn't get inspired by it, huh?

## Explanation

* The ant begins at (0,0) and initially makes a step to the cube in front of it. 
* Every time the ant steps on a cube, this cube changes its color. 
* Each color has a direction, meaning depending on the color of the cube the ant will turn left or right.
* Therefore, depending on how many colors you make available and which direction you assign to each color, the ant will create different colored cube-based patterns.

## How to use it?

* **Speed Slider:** Amount of steps the ant will take per frame rendered. The more to the right, the faster the ant will go. **Note**: Extreme values might make your browser a bit slow. :snail:

* **Steps Input:** Series of *R*s or *1*s (rights) and *L*s or *0*s (lefts). You can add or delete them as you like. The n-th letter refers to the direction the ant will take when it steps over the cube for the n-th time. So for example, *R L L R* or *1 0 0 1* would mean:

    1)  the first time the ant steps over that cube, it turns to the *right*. 

    2) the second time it returns and steps over that same cube it will turn to the *left*.

    3) the third time it will turn to the *right*.

    4) the fourth time it will turn to the *left*.

    5) the fifth time the sequence would start over, so it would go *right*.

Also, remember you can zoom and rotate the camera around! :camera:



## Authors :boy:

* **Maurici Abad** - [@mauriciabad](https://github.com/mauriciabad)
* **Xavier Lacasa** - [@xlacasa](https://github.com/xlacasa)
