export function rollD6() {
  const min = 1;
  const max = 6;
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export function rollD3() {
  const min = 1;
  const max = 3;
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

export function variableCalculator(variable: string) {
  switch (variable) {
    case "0":
      return 0;
    case "1":
      return 1;
    case "3":
      return 3;
    case "D3":
      return rollD3();
    case "2D3":
      return rollD3() + rollD3();
    case "3D3":
      return rollD3() + rollD3() + rollD3();
    case "D6":
      return rollD6();
    case "2D6":
      return rollD6() + rollD6();
    case "3D6":
      return rollD6() + rollD6() + rollD6();
    default:
      return 0;
  }
} 