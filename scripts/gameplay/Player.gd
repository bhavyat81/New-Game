extends CharacterBody2D

@export var move_speed: float = 150.0
var joystick_vector: Vector2 = Vector2.ZERO
var carried_items: Dictionary = {}

func _physics_process(_delta):
	velocity = joystick_vector * move_speed
	move_and_slide()

func set_joystick_input(dir: Vector2):
	joystick_vector = dir

func collect_item(item_type: String):
	carried_items[item_type] = carried_items.get(item_type, 0) + 1

func has_item(item_type: String) -> bool:
	return carried_items.get(item_type, 0) > 0

func remove_item(item_type: String):
	if carried_items.has(item_type):
		carried_items[item_type] -= 1
		if carried_items[item_type] <= 0:
			carried_items.erase(item_type)
