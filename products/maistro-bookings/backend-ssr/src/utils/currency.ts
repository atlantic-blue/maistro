export const formatPrice = (n: number) =>
  `€${n.toLocaleString("es-ES", { maximumFractionDigits: 2 })}`;
