type Monster = {
  id: string;
  name: string;
  dexterity: number;
  armor_class: {
    value: number;
  };
  hit_points: number;
  damage_immunities: string[];
  damage_resistances: string[];
  damage_vulnerabilities: string[];
  proficiencies: {
    value: number;
    proficiency: {
      index: number;
    };
  }[];
};

export default Monster;
