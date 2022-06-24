import {
    Computed as KnockoutComputed,
} from 'knockout';
import NotificationConstants from '../notifications/NotificationConstants';
import Notifier from '../notifications/Notifier';
import AchievementRequirement from '../requirements/AchievementRequirement';
import * as GameConstants from '../GameConstants';
import { LogBookTypes } from '../logbook/LogBookTypes';
import LogEvent from '../LogEvent';

export default class Achievement {
    public isCompleted: KnockoutComputed<boolean> = ko.pureComputed(() => this.achievable() && (this.unlocked || this.property.isCompleted()));
    public getProgressText: KnockoutComputed<string> = ko.pureComputed(() => `${this.getProgress()}/${this.property.requiredValue}`);
    public bonus = 0;
    public unlocked = false;

    constructor(
        public name: string,
        public description: string,
        public property: AchievementRequirement,
        public bonusWeight: number,
        public region: GameConstants.Region,
        public achievableFunction: () => boolean | null = null,
    ) {}

    public check() {
        if (this.isCompleted()) {
            Notifier.notify({
                title: `[Achievement] ${this.name}`,
                message: this.description,
                type: NotificationConstants.NotificationOption.warning,
                timeout: 1e4,
                sound: NotificationConstants.NotificationSound.General.achievement,
                setting: NotificationConstants.NotificationSetting.General.achievement_complete,
            });
            App.game.logbook.newLog(
                LogBookTypes.ACHIEVE,
                `Earned "${this.name}".`,
            );
            this.unlocked = true;
            // TODO: refilter within achievement bonus
            // AchievementHandler.filterAchievementList(true);
            // Track when users gains an achievement and their total playtime
            LogEvent('completed achievement', 'achievements', `completed achievement (${this.name})`, App.game.statistics.secondsPlayed());
        }
    }

    public getProgress() {
        return this.isCompleted() ? this.property.requiredValue : this.property.getProgress();
    }

    public getProgressPercentage() {
        return this.isCompleted() ? '100.0' : this.property.getProgressPercentage();
    }

    public getBonus(): string {
        return this.bonus.toFixed(2);
    }

    public achievable() {
        if (typeof this.achievableFunction === 'function') {
            return this.achievableFunction();
        }
        return true;
    }
}
