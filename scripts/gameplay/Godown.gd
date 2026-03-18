extends Node2D

const DELIVERY_TIME = 8.0
var pending: Dictionary = {}

func place_order(item_type: String):
	if pending.has(item_type):
		return
	pending[item_type] = true
	EventBus.emit_signal("order_placed", item_type)
	_deliver(item_type)

func _deliver(item_type: String):
	await get_tree().create_timer(DELIVERY_TIME).timeout
	pending.erase(item_type)
	_spawn_item(item_type)
	EventBus.emit_signal("order_arrived", item_type)

func _spawn_item(item_type: String):
	for i in range(4):
		var item = preload("res://scenes/gameplay/GodownItem.tscn").instantiate()
		item.item_type = item_type
		item.global_position = global_position + Vector2(randf_range(-60, 60), randf_range(-20, 20))
		get_parent().add_child(item)
