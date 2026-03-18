extends Area2D

@export var item_type: String = "nails"
@export var max_stock: int = 4
@export var is_unlocked: bool = true
@export var unlock_cost: int = 0

var current_stock: int = 4

@onready var stock_label: Label = $StockLabel
@onready var lock_overlay: ColorRect = $LockOverlay

func _ready():
	current_stock = max_stock if is_unlocked else 0
	_update_display()
	GameManager.connect("shelf_unlocked", _on_shelf_unlocked)
	connect("body_entered", _on_body_entered)

func take_item() -> bool:
	if current_stock > 0 and is_unlocked:
		current_stock -= 1
		_update_display()
		return true
	return false

func restock(amount: int):
	current_stock = min(current_stock + amount, max_stock)
	_update_display()
	EventBus.emit_signal("shelf_restocked", item_type)

func _on_shelf_unlocked(shelf_id: String):
	if shelf_id == item_type:
		is_unlocked = true
		current_stock = max_stock
		_update_display()

func _update_display():
	if stock_label:
		stock_label.text = str(current_stock) + "/" + str(max_stock)
	if lock_overlay:
		lock_overlay.visible = not is_unlocked

func _on_body_entered(body):
	if body.is_in_group("customers"):
		var c = body as CharacterBody2D
		if c.get("target_item") == item_type and c.get("state") == 1: # WAITING_AT_SHELF
			if take_item():
				c.pick_item()
	elif body.is_in_group("player"):
		var p = body
		if p.has_method("has_item") and p.has_item(item_type):
			restock(1)
			p.remove_item(item_type)
