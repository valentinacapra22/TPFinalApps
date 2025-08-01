import * as geoNames from "../services/enumGeoNamesService.mjs";
import catchAsync from "../helpers/catchAsync.mjs";

export const getPais = catchAsync(async (req, res) => {
  const pais = await geoNames.getPais();
  res.status(200).json(pais);
});

export const getProvincia = catchAsync(async (req, res) => {
  const { paisId } = req.body;
  const provincia = await geoNames.getProvincia(paisId);
  res.status(200).json(provincia);
});

export const getLocalidad = catchAsync(async (req, res) => {
  const { provinciaId } = req.body;
  const localidad = await geoNames.getLocalidad(provinciaId);
  res.status(200).json(localidad);
});
