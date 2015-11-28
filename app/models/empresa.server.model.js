var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SucursalSchema = new Schema({
  direccion: {
    type: String,
    default: '',
    trim: true,
  },
  telefono: {
    type: String,
    default: '',
    trim: true
  },
  provincia: {
    type: String,
    default: '',
    trim: true
  },
  localidad: {
    type: String,
    default: '',
    trim: true
  }
  
});

var EmpresaSchema = new Schema({
  creado: {
    type: Date,
    default: Date.now
  },
  nombre: {
    type: String,
    default: '',
    trim: true,
    required: 'El nombre no puede estar en blanco'
  },
  telefono: {
    type: String,
    default: '',
    trim: true
  },
  web: {
    type: String,
    default: '',
    trim: true
  },
  sucursales : [SucursalSchema],
  creador: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  zona: {
    //type: Object,
    //index: '2dsphere', 
    type: {type: String,enum: "Polygon", default: "Polygon"},
    coordinates: []//{
     // type:[],
    //  default: []
    //}
  },
});

<<<<<<< HEAD
=======
EmpresaSchema.index({ 'zona' : '2dsphere' });

>>>>>>> 1ce5bc940c9c744416dc6fe5d335f16341ed6c3b
mongoose.model('Empresa', EmpresaSchema);