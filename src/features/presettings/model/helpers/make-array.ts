export function makeArray(to:number){
  return Array.from({ length: to }, (_, i) => i + 1)
}