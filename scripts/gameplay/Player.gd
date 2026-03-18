extends CharacterBody2D

@export var move_speed: float = 200.0
var joystick_vector: Vector2 = Vector2.ZERO
var carried_items: Dictionary = {}

func _physics_process(_delta):
	var kb_dir = Vector2.ZERO
	if Input.is_key_pressed(KEY_LEFT) or Input.is_key_pressed(KEY_A):
		kb_dir.x -= 1
	if Input.is_key_pressed(KEY_RIGHT) or Input.is_key_pressed(KEY_D):
		kb_dir.x += 1
	if Input.is_key_pressed(KEY_UP) or Input.is_key_pressed(KEY_W):
		kb_dir.y -= 1
	if Input.is_key_pressed(KEY_DOWN) or Input.is_key_pressed(KEY_S):
		kb_dir.y += 1

	var final_dir = joystick_vector
	if kb_dir.length() > 0:
		final_dir = kb_dir.normalized()

	velocity = final_dir * move_speed
	move_and_slide()

	if has_node("ItemLabel"):
		var items_str = ""
		for k in carried_items:
			items_str += "%s:%d " % [k, carried_items[k]]
		$ItemLabel.text = items_str.strip_edges()

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