import { BlueprintBuilding } from "@/blueprint/parser";

export class BuilToop{
    /**
     * 特殊处理的设备
     * @param buildings 
     */
    public static changeRecipeId(buildings: BlueprintBuilding):void{
        //分馏塔默认配方为115
        if(buildings.itemId == 2314)
            buildings.recipeId = 115;
    }
}