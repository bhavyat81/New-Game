extends CharacterBody2D

@export var move_speed: float = 200.0
var joystick_vector: Vector2 = Vector2.ZERO
var carried_items: Dictionary = {}

const ITEM_EMOJIS := {
	"nails": "🔩", "wire": "⚡", "paint": "🎨",
	"pipes": "🔧", "nuts": "🥜", "cement": "🧱"
}

func _ready() -> void:
	add_to_group("player")
	queue_redraw()

func _physics_process(_delta: float) -> void:
	var kb_dir := Vector2.ZERO
	if Input.is_key_pressed(KEY_LEFT) or Input.is_key_pressed(KEY_A):
		kb_dir.x -= 1
	if Input.is_key_pressed(KEY_RIGHT) or Input.is_key_pressed(KEY_D):
		kb_dir.x += 1
	if Input.is_key_pressed(KEY_UP) or Input.is_key_pressed(KEY_W):
		kb_dir.y -= 1
	if Input.is_key_pressed(KEY_DOWN) or Input.is_key_pressed(KEY_S):
		kb_dir.y += 1

	var final_dir := joystick_vector
	if kb_dir.length() > 0:
		final_dir = kb_dir.normalized()

	velocity = final_dir * move_speed
	move_and_slide()

	if has_node("ItemLabel"):
		var parts: Array[String] = []
		for k in carried_items:
			if carried_items[k] > 0:
				parts.append(ITEM_EMOJIS.get(k, "📦") + "x" + str(carried_items[k]))
		$ItemLabel.text = "  ".join(parts)

func _draw() -> void:
	# Drop shadow
	draw_circle(Vector2(0.0, 28.0), 18.0, Color(0.0, 0.0, 0.0, 0.08))
	draw_circle(Vector2(0.0, 28.0), 13.0, Color(0.0, 0.0, 0.0, 0.06))

	# Legs (dark blue trousers)
	draw_rect(Rect2(-11.0, 12.0, 10.0, 20.0), Color(0.18, 0.22, 0.55))
	draw_rect(Rect2(2.0, 12.0, 10.0, 20.0), Color(0.18, 0.22, 0.55))
	# Shoes
	draw_rect(Rect2(-13.0, 28.0, 12.0, 7.0), Color(0.12, 0.08, 0.06))
	draw_rect(Rect2(2.0, 28.0, 12.0, 7.0), Color(0.12, 0.08, 0.06))

	# Body / shirt (cream)
	draw_rect(Rect2(-14.0, -20.0, 28.0, 34.0), Color(0.92, 0.88, 0.78))
	# Apron (orange-brown) — shopkeeper look
	draw_rect(Rect2(-10.0, -17.0, 20.0, 30.0), Color(0.85, 0.52, 0.14))
	# Apron pocket
	draw_rect(Rect2(-6.0, -6.0, 8.0, 7.0), Color(0.72, 0.40, 0.08))
	draw_rect(Rect2(-6.0, -6.0, 8.0, 7.0), Color(0.55, 0.28, 0.05), false, 1.0)
	# Apron strings
	draw_line(Vector2(-10.0, -17.0), Vector2(-14.0, -20.0), Color(0.72, 0.40, 0.08), 2.0)
	draw_line(Vector2(10.0, -17.0), Vector2(14.0, -20.0), Color(0.72, 0.40, 0.08), 2.0)

	# Arms (skin tone)
	draw_rect(Rect2(-22.0, -18.0, 9.0, 22.0), Color(0.90, 0.72, 0.55))
	draw_rect(Rect2(14.0, -18.0, 9.0, 22.0), Color(0.90, 0.72, 0.55))

	# Neck
	draw_rect(Rect2(-4.0, -22.0, 8.0, 5.0), Color(0.90, 0.72, 0.55))

	# Head (skin)
	draw_circle(Vector2(0.0, -32.0), 13.0, Color(0.92, 0.74, 0.56))

	# Hair (dark)
	draw_circle(Vector2(0.0, -42.0), 10.0, Color(0.12, 0.08, 0.06))
	draw_rect(Rect2(-10.0, -42.0, 20.0, 11.0), Color(0.12, 0.08, 0.06))

	# Eyes
	draw_circle(Vector2(-5.0, -34.0), 2.5, Color(0.08, 0.08, 0.08))
	draw_circle(Vector2(5.0, -34.0), 2.5, Color(0.08, 0.08, 0.08))
	# Eye shine
	draw_circle(Vector2(-4.0, -35.0), 1.0, Color(1.0, 1.0, 1.0, 0.8))
	draw_circle(Vector2(6.0, -35.0), 1.0, Color(1.0, 1.0, 1.0, 0.8))

	# Smile
	draw_circle(Vector2(-3.5, -27.5), 1.5, Color(0.65, 0.25, 0.18))
	draw_circle(Vector2(3.5, -27.5), 1.5, Color(0.65, 0.25, 0.18))

	# Item in hand (when carrying)
	if carried_items.size() > 0:
		draw_rect(Rect2(-10.0, 5.0, 20.0, 14.0), Color(0.72, 0.52, 0.22))
		draw_rect(Rect2(-10.0, 5.0, 20.0, 14.0), Color(0.45, 0.30, 0.10), false, 1.5)
		draw_line(Vector2(0.0, 5.0), Vector2(0.0, 19.0), Color(0.45, 0.30, 0.10), 1.0)
		draw_line(Vector2(-10.0, 12.0), Vector2(10.0, 12.0), Color(0.45, 0.30, 0.10), 1.0)

func set_joystick_input(dir: Vector2) -> void:
	joystick_vector = dir

func collect_item(item_type: String) -> void:
	carried_items[item_type] = carried_items.get(item_type, 0) + 1
	queue_redraw()

func has_item(item_type: String) -> bool:
	return carried_items.get(item_type, 0) > 0

func remove_item(item_type: String) -> void:
	if carried_items.has(item_type):
		carried_items[item_type] -= 1
		if carried_items[item_type] <= 0:
			carried_items.erase(item_type)
		queue_redraw()
