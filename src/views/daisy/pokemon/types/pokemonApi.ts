export interface getPokemonListInterFace {
  file_name: String,
  height: number,
  pokemon_name: string,
  pokemon_sub_name: string,
  pokemon_type_id: string,
  pokemon_type_name: string,
  weight: number,
  zukan_id: string,
  zukan_sub_id: number,
  pokemon_type_id_arry?: string[],
  pokemon_type_name_arry?: string[],
  [key: string]: any
}