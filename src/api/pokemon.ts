import request from "@/utils/request";

export function getPokemonDetail(id:any) {
  return request({
    method: "get",
    url: `https://pokeapi.co/api/v2/pokemon/${id}`,
  });
}
export function getPokemonList(parmas:any) {
  return request({
    method: "get",
    url: `/play/pokedex`,
    params: parmas,
  });
}