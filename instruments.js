var grids = [2, 1, 1/2, 1/4, 1/8, 1/16, 1/32, 1/24, 1/12, 1/6, 1/3, 2/3]

module.exports = {
  drums: {
    grids: grids,
    channel: 144
  },

  pad: {
    grids: grids,
    notes: [48,50,52,55,57,60,62,64,67,69,72,74,76,79,81],
    channel: 145
  },

  bass: {
    grids: grids,
    notes: [36, 38, 40, 43, 45],
    channel: 146
  },

  lead: {
    grids: grids,
    notes: [72,74,76,79,81,84,86,88,91,93,96,98,100,103,105,106,94,82,70],
    channel: 147
  }
};
