extends Area2D

@export var item_type: String = "nails"
@export var max_stock: int = 4
@export var is_unlocked: bool = true
@export var unlock_cost: int = 0

var current_stock: int = 4

const ITEM_EMOJIS := {
	"nails": "🔩", "wire": "⚡", "paint": "🎨",
	"pipes": "🔧", "nuts": "🥜", "cement": "🧱"
}
const ITEM_NAMES := {
	"nails": "Nails", "wire": "Wire", "paint": "Paint",
	"pipes": "Pipes", "nuts": "Nuts", "cement": "Cement"
}
# Shelf wood colors
const WOOD_DARK := Color(0.42, 0.26, 0.08)
const WOOD_MID := Color(0.58, 0.38, 0.14)
const WOOD_LIGHT := Color(0.72, 0.52, 0.22)

@onready var stock_label: Label = $StockLabel
@onready var type_label: Label = $TypeLabel

func _ready() -> void:
	current_stock = max_stock if is_unlocked else 0
	_update_display()
	GameManager.connect("shelf_unlocked", _on_shelf_unlocked)
	connect("body_entered", _on_body_entered)

func _draw() -> void:
	# == Shelf back wall ==
	draw_rect(Rect2(-50.0, -30.0, 100.0, 60.0), WOOD_DARK)

	# == Shelf planks (3 horizontal boards) ==
	draw_rect(Rect2(-50.0, -30.0, 100.0, 10.0), WOOD_MID)  # top plank
	draw_rect(Rect2(-50.0,   0.0, 100.0,  8.0), WOOD_MID)  # middle plank
	draw_rect(Rect2(-50.0,  22.0, 100.0, 10.0), WOOD_MID)  # bottom plank

	# Plank highlight lines
	draw_line(Vector2(-50.0, -30.0), Vector2(50.0, -30.0), WOOD_LIGHT, 1.5)
	draw_line(Vector2(-50.0,   0.0), Vector2(50.0,   0.0), WOOD_LIGHT, 1.5)
	draw_line(Vector2(-50.0,  22.0), Vector2(50.0,  22.0), WOOD_LIGHT, 1.5)

	# Side supports (vertical posts)
	draw_rect(Rect2(-50.0, -30.0, 8.0, 60.0), WOOD_MID)
	draw_rect(Rect2( 42.0, -30.0, 8.0, 60.0), WOOD_MID)

	# == Stock item dots (top shelf area: y -20 to -3) ==
	if is_unlocked:
		for i in range(max_stock):
			var sx := -35.0 + float(i) * 20.0
			var sy := -18.0
			var filled := i < current_stock
			if filled:
				draw_circle(Vector2(sx, sy), 7.0, _item_color())
				draw_circle(Vector2(sx, sy), 7.0, WOOD_DARK, false, 1.0)
			else:
				draw_circle(Vector2(sx, sy), 7.0, Color(0.3, 0.3, 0.3, 0.4))
				draw_circle(Vector2(sx, sy), 7.0, Color(0.5, 0.5, 0.5, 0.4), false, 1.0)

	# == Lock overlay ==
	if not is_unlocked:
		draw_rect(Rect2(-50.0, -30.0, 100.0, 60.0), Color(0.1, 0.1, 0.1, 0.72))
		# Padlock body
		draw_circle(Vector2(0.0, -2.0), 12.0, Color(0.75, 0.65, 0.1))
		draw_rect(Rect2(-8.0, -2.0, 16.0, 14.0), Color(0.65, 0.55, 0.08))
		# Padlock shackle
		draw_arc(Vector2(0.0, -2.0), 8.0, PI, TAU, 16, Color(0.75, 0.65, 0.1), 3.0)

func _item_color() -> Color:
	match item_type:
		"nails": return Color(0.7, 0.7, 0.75)
		"wire": return Color(0.9, 0.8, 0.1)
		"paint": return Color(0.3, 0.6, 0.9)
		"pipes": return Color(0.7, 0.4, 0.2)
		"nuts": return Color(0.8, 0.7, 0.3)
		"cement": return Color(0.7, 0.7, 0.68)
	return Color(0.7, 0.7, 0.7)

func take_item() -> bool:
	if current_stock > 0 and is_unlocked:
		current_stock -= 1
		_update_display()
		return true
	return false

func restock(amount: int) -> void:
	current_stock = min(current_stock + amount, max_stock)
	_update_display()
	EventBus.emit_signal("shelf_restocked", item_type)

func _on_shelf_unlocked(shelf_id: String) -> void:
	if shelf_id == item_type:
		is_unlocked = true
		current_stock = max_stock
		_update_display()

func _update_display() -> void:
	if stock_label:
		stock_label.text = str(current_stock) + "/" + str(max_stock)
	if type_label:
		var emoji := ITEM_EMOJIS.get(item_type, "📦")
		var iname := ITEM_NAMES.get(item_type, item_type.capitalize())
		if is_unlocked:
			type_label.text = emoji + " " + iname
		else:
			var cost_str := (" • 🪙" + str(unlock_cost)) if unlock_cost > 0 else ""
			type_label.text = emoji + " " + iname + cost_str
	queue_redraw()

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("customers"):
		var c := body as CharacterBody2D
		if c.get("target_item") == item_type and c.get("state") == 1: # WAITING_AT_SHELF
			if take_item():
				c.pick_item()
	elif body.is_in_group("player"):
		var p := body
		if p.has_method("has_item") and p.has_item(item_type):
			restock(1)
			p.remove_item(item_type)
