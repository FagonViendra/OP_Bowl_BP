import { world, system } from "@minecraft/server";

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const inventory = player.getComponent("minecraft:inventory");
        if (!inventory || !inventory.container) continue;

        const selectedSlot = player.selectedSlotIndex;
        const mainhand = inventory.container.getItem(selectedSlot);

        if (mainhand && mainhand.typeId === "custom:op_bowl") {
            player.addEffect("night_vision", 300, {
                amplifier: 0,
                showParticles: false
            });
        }
    }
}, 80);
