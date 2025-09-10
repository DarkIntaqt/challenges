interface IChampionDTO {
   name: string;
   id: string;
   key: number;
   spells: { [key: string]: SpellDTO };
}

interface IChampionFullDTO {
   version: string;
   data: { [key: string]: ChampionDTO };
}

export type { IChampionDTO, IChampionFullDTO };
