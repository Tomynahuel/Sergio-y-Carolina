// src/data/invitados.js

// Tu lista única y centralizada de invitados
export const listaInvitados = [
  { nombre: 'juan perez', paga: true },
  { nombre: 'carolina ramirez', paga: false },
  { nombre: 'familia gomez', paga: true },
  { nombre: 'sergio martinez', paga: false }
];

/**
 * Busca un invitado ignorando mayúsculas, tildes y espacios extra.
 * @param {string} nombreIngresado 
 * @returns {object|null} El objeto del invitado o null si no existe.
 */
export function obtenerInvitado(nombreIngresado) {
  if (!nombreIngresado) return null;

  const nombreLimpio = nombreIngresado
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return listaInvitados.find(invitado => {
    const nombreDBLimpio = invitado.nombre
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return nombreDBLimpio === nombreLimpio;
  });
}