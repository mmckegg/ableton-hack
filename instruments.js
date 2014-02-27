var grids = [1, 1/2, 1/4, 1/8, 1/16, 1/32, 1/24, 1/12, 1/6, 1/3, 2/3]

module.exports = {
  drums: {
    grids: grids,
    notes: [30,31,32,33],
    channel: 144
  },

  pad: {
    grids: [1/4, 1/8],//[1/16, 1/32, 1/24, 1/12, 1/6, 1/3],
    legato: true,
    notes: [48,50,52,53,55,52,60],//55,57,60,62,64,67,69],//,72,74,76,79,81],
    channel: 145
  },

  bass: {
    grids: [1/8, 1/4],
    legato: true,
    notes: [36, 38, 40,41],
    channel: 146
  },

  lead: {
    grids: grids,
    notes: [72,74,76,79,81,84,86,88,91,93],//,96,98,100,103,105,106,94,82,70],
    channel: 147
  }
};
