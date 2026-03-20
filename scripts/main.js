import { world, system } from "@minecraft/server";

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const equippable = player.getComponent("minecraft:equippable");
        if (!equippable) continue;

        const mainhand = equippable.getEquipment("Mainhand");

        if (mainhand && mainhand.typeId === "custom:op_bowl") {
            player.addEffect("night_vision", 300, {
                amplifier: 0,
                showParticles: false
            });
        }
    }
}, 80);
