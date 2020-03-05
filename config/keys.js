module.exports = {
  mongoURI: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  secretOrKey: process.env.SECRET_OR_KEY,
  jwtExpiry: parseInt(process.env.JWT_EXPIRY),
}
// module.exports = {
//   mongoURI: 'mongodb://localhost:27017/nodeboilerplate',
//   options: {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   },
//   secretOrKey: 'secret',
//   jwtExpiry: 900
// }