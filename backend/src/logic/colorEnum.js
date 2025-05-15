/*
"""
Mapping of letter feedback codes to their display colors.

Defines a simple enum object where:
- `g` stands for green (correct letter & position),
- `y` stands for yellow (correct letter, wrong position)(represented in the frontend by 'gold'),
- `b` stands for black (letter not in word) (represented in the frontend by 'dark slate grey'),,
- `o` stands for grey (initial/default state).
"""
*/
const colorEnum = { g: 'green', b: 'darkslategrey', y: 'gold', o: 'grey' };
export { colorEnum };