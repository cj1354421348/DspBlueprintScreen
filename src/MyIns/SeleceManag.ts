import { BaseIns } from "./BaseIns";

/**
 * 选择管理器
 * 该类用于管理选择的图标id
 */
export class SeleceManag extends BaseIns {
    /**
     * 构造函数
     */
    constructor() {
        super();
    }
    /**
     * 选择的图标id
     */
    private seleceIcon = new Set<number>();
    /**
     * 排除的图标id
     */
    private excludeIcon = new Set<number>();
    /**
     * 设置选择的图标id
     * @param icon 图标id
     * @param include 是否选择
     */
    public setSeleceIcon(icon: number, include: boolean) {
        if (include) {
        this.seleceIcon.add(icon);
        } else {
        this.seleceIcon.delete(icon);
        }
    }
    /**
     * 设置排除的图标id
     * @param icon 图标id
     * @param include 是否排除
     */
    public setExcludeIcon(icon: number, include: boolean) {
        if (include) {
        this.excludeIcon.add(icon);
        } else {
        this.excludeIcon.delete(icon);
        }
    }
    /**
     * 获取选择的图标id数组
     */
    public get seleceIconArr(): number[] {
        return Array.from(this.seleceIcon);
    }
    /**
     * 获取排除的图标id数组
     */
    public get excludeIconArr(): number[] {
        return Array.from(this.excludeIcon);
    }

    /**
     * 是否包含选择的图标
     * @param icon 图标id
     * @returns 是否包含选择的图标
     */
    public haveSeleceIcon(icon: number): boolean {
        return this.seleceIcon.has(icon);
    }

    /**
     * 是否包含排除的图标
     * @param icon 图标id
     * @returns 是否包含排除的图标
     */
    public haveExcludeIcon(icon: number): boolean {
        return this.excludeIcon.has(icon);
    }
    public clear() {
        this.seleceIcon.clear();
        this.excludeIcon.clear();
    }

}
