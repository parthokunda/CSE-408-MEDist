import Brand from "./Brand.model";
import Description from "./Description.model";
import DosageForm from "./DosageForm.model";
import Generic from "./Generic.model";
import Manufacturer from "./Manufacturer.model";


/* ................ Define associations ................. */

// between Brand and Generic
Brand.belongsTo(Generic, {
  foreignKey: "genericID",
});
Generic.hasMany(Brand, {
  foreignKey: "genericID",
});

// between Brand and DosageForm
Brand.belongsTo(DosageForm, {
  foreignKey: "dosageFormID",
});
DosageForm.hasMany(Brand, {
  foreignKey: "dosageFormID",
});

// between Brand and Manufacturer
Brand.belongsTo(Manufacturer, {
  foreignKey: "manufacturerID",
});
Manufacturer.hasMany(Brand, {
  foreignKey: "manufacturerID",
});

// between Brand and Description
Brand.belongsTo(Description, {
  foreignKey: {
    name: "descriptionID",
    allowNull: true,
  },
});
Description.hasOne(Brand, {
  foreignKey: {
    name: "descriptionID",
    allowNull: true,
  },
});
