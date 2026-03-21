import { world, system, InputButton, ButtonState } from "@minecraft/server";

const summonCooldown = new Set();

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const inventory = player.getComponent("minecraft:inventory");
        if (!inventory?.container) continue;

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

world.afterEvents.playerButtonInput.subscribe((event) => {
    if (event.button !== InputButton.Sneak) return;
    if (event.newButtonState !== ButtonState.Pressed) return;

    const player = event.player;
    const inventory = player.getComponent("minecraft:inventory");
    if (!inventory?.container) return;

    const selectedSlot = player.selectedSlotIndex;
    const mainhand = inventory.container.getItem(selectedSlot);

    if (!mainhand || mainhand.typeId !== "custom:op_bowl") return;

    const key = player.name;
    if (summonCooldown.has(key)) return;

    summonCooldown.add(key);
    system.runTimeout(() => summonCooldown.delete(key), 40); // 2 giây cooldown

    const dir = player.getViewDirection();
    const spawnPos = {
        x: player.location.x + dir.x * 2,
        y: player.location.y,
        z: player.location.z + dir.z * 2
    };

    try {
        player.dimension.spawnEntity("minecraft:zombie", spawnPos);
    } catch (e) {
        console.warn(`Không thể spawn zombie: ${e}`);
    }
});