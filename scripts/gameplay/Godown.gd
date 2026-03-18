extends Node2D

const DELIVERY_TIME := 8.0
var pending: Dictionary = {}

const CRATE_DARK := Color(0.32, 0.20, 0.06)
const CRATE_MID := Color(0.52, 0.36, 0.12)
const CRATE_LIGHT := Color(0.70, 0.54, 0.24)
const CRATE_STRIPE := Color(0.28, 0.16, 0.04)

func _draw() -> void:
# Background
draw_rect(Rect2(-170.0, -60.0, 340.0, 120.0), Color(0.22, 0.15, 0.07))

# Border
draw_rect(Rect2(-170.0, -60.0, 340.0, 120.0), CRATE_DARK, false, 3.0)

# Crate pattern — 4 crates in a row
var crate_positions := [
Vector2(-130.0, -15.0),
Vector2(-50.0, -15.0),
Vector2(30.0, -15.0),
Vector2(110.0, -15.0),
]
for cp in crate_positions:
_draw_crate(cp)

# Floor line / shelf shadow
draw_line(Vector2(-170.0, 40.0), Vector2(170.0, 40.0), CRATE_DARK, 2.0)

# "ORDER" area highlight
draw_rect(Rect2(-80.0, 44.0, 160.0, 14.0), Color(0.40, 0.28, 0.08, 0.6))
draw_rect(Rect2(-80.0, 44.0, 160.0, 14.0), CRATE_MID, false, 1.5)

func _draw_crate(pos: Vector2) -> void:
var w := 60.0
var h := 48.0
var x := pos.x - w * 0.5
var y := pos.y - h * 0.5
# Crate body
draw_rect(Rect2(x, y, w, h), CRATE_MID)
# Cross brace lines
draw_line(Vector2(x, y), Vector2(x + w, y + h), CRATE_STRIPE, 1.5)
draw_line(Vector2(x + w, y), Vector2(x, y + h), CRATE_STRIPE, 1.5)
# Horizontal bands
draw_line(Vector2(x, y + h * 0.33), Vector2(x + w, y + h * 0.33), CRATE_STRIPE, 1.5)
draw_line(Vector2(x, y + h * 0.66), Vector2(x + w, y + h * 0.66), CRATE_STRIPE, 1.5)
# Border
draw_rect(Rect2(x, y, w, h), CRATE_LIGHT, false, 1.5)

func place_order(item_type: String) -> void:
if pending.has(item_type):
return
pending[item_type] = true
EventBus.emit_signal("order_placed", item_type)
_deliver(item_type)

func _deliver(item_type: String) -> void:
await get_tree().create_timer(DELIVERY_TIME).timeout
pending.erase(item_type)
_spawn_item(item_type)
EventBus.emit_signal("order_arrived", item_type)

func _spawn_item(item_type: String) -> void:
for i in range(4):
var item = preload("res://scenes/gameplay/GodownItem.tscn").instantiate()
item.item_type = item_type
item.global_position = global_position + Vector2(randf_range(-60.0, 60.0), randf_range(-20.0, 20.0))
get_parent().add_child(item)
