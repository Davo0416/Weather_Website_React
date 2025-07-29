const mongoose = require('mongoose');

// DB user model schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  weather: mongoose.Schema.Types.Mixed,
  notifications: {
    type: [Object],
    default: [],
  },
  routesState: {
    type: Object,
    default: { routes: [], currentRoute: null },
  },
  settings: {
    type: Object,
    default: {
      sidenavColor: "info",
      darkMode: false,
      imperialUnits: false,
      fixedNavbar: false,
      transparentSidenav: true,
      whiteSidenav: false
    },
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
