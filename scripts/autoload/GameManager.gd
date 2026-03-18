extends Node

var coins: int = 50
var gems: int = 5
var level: int = 1
var xp: int = 0
var xp_to_next: int = 100

signal coins_changed(new_amount)
signal xp_changed(new_xp)
signal level_up(new_level)
signal shelf_unlocked(shelf_id)

const UNLOCK_COSTS = {
	"pipes": 150,
	"paint": 300,
	"nuts": 500,
	"cement": 1000
}

func add_coins(amount: int) -> void:
	coins += amount
	emit_signal("coins_changed", coins)
	_check_unlock_banner()

func spend_coins(amount: int) -> bool:
	if coins >= amount:
		coins -= amount
		emit_signal("coins_changed", coins)
		return true
	return false

func add_xp(amount: int) -> void:
	xp += amount
	if xp >= xp_to_next:
		xp -= xp_to_next
		level += 1
		xp_to_next = int(xp_to_next * 1.5)
		emit_signal("level_up", level)
	emit_signal("xp_changed", xp)

func unlock_shelf(shelf_id: String) -> bool:
	var cost = UNLOCK_COSTS.get(shelf_id, 0)
	if spend_coins(cost):
		emit_signal("shelf_unlocked", shelf_id)
		return true
	return false

func _check_unlock_banner() -> void:
	for shelf_id in UNLOCK_COSTS:
		if coins >= UNLOCK_COSTS[shelf_id]:
			EventBus.emit_signal("show_unlock_banner", shelf_id)
			return

func save_game() -> void:
	var data = {"coins": coins, "gems": gems, "level": level, "xp": xp}
	var file = FileAccess.open("user://save.json", FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify(data))
	file.close()

func load_game() -> void:
	if not FileAccess.file_exists("user://save.json"):
		return
	var file = FileAccess.open("user://save.json", FileAccess.READ)
	if file == null:
		return
	var data = JSON.parse_string(file.get_as_text())
	file.close()
	if data:
		coins = data.get("coins", 50)
		gems = data.get("gems", 5)
		level = data.get("level", 1)
		xp = data.get("xp", 0)
