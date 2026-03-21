import { world, system } from "@minecraft/server";

// ===== Hiệu ứng Night Vision khi cầm bát =====
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

// ===== Triệu hồi Zombie khi chuột phải với bát =====
world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;

    if (!item || item.typeId !== "custom:op_bowl") return;

    // Lấy hướng nhìn và vị trí người chơi
    const view = player.getViewDirection();
    const loc = player.location;

    // Spawn zombie cách 3 block phía trước mặt người chơi
    const spawnPos = {
        x: loc.x + view.x * 3,
        y: loc.y + view.y * 3,
        z: loc.z + view.z * 3
    };

    try {
        const zombie = player.dimension.spawnEntity("minecraft:zombie", spawnPos);
        player.sendMessage("§a§l⚡ Đã triệu hồi Zombie!");

        // Hiệu ứng particle tại vị trí spawn
        player.dimension.runCommand(
            `particle minecraft:large_explosion ${spawnPos.x} ${spawnPos.y} ${spawnPos.z}`
        );

        // Âm thanh triệu hồi
        player.playSound("mob.zombie.say");
    } catch (e) {
        player.sendMessage("§c§lKhông thể triệu hồi Zombie tại vị trí này!");
    }
});
