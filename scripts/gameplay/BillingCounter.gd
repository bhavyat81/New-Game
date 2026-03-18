extends Area2D

var player_here: bool = false
var waiting_customers: Array = []
var flash_timer: float = 0.0

const COUNTER_DARK := Color(0.30, 0.18, 0.06)
const COUNTER_MID := Color(0.55, 0.38, 0.14)
const COUNTER_TOP := Color(0.72, 0.52, 0.22)
const COUNTER_GOLD := Color(0.90, 0.72, 0.12)

func _ready() -> void:
	connect("body_entered", _on_body_entered)
	connect("body_exited", _on_body_exited)

func _process(delta: float) -> void:
	if flash_timer > 0.0:
		flash_timer -= delta
		queue_redraw()

func _draw() -> void:
	var is_flashing := flash_timer > 0.0
	var flash_c := Color(1.0, 0.95, 0.5, 0.35) if is_flashing else Color(0.0, 0.0, 0.0, 0.0)

	# Counter body (front face)
	draw_rect(Rect2(-160.0, -10.0, 320.0, 35.0), COUNTER_MID)
	# Counter top surface
	draw_rect(Rect2(-160.0, -25.0, 320.0, 17.0), COUNTER_TOP)
	# Counter base shadow
	draw_rect(Rect2(-160.0, 23.0, 320.0, 4.0), COUNTER_DARK)

	# Decorative gold trim on top edge
	draw_line(Vector2(-160.0, -25.0), Vector2(160.0, -25.0), COUNTER_GOLD, 2.5)
	draw_line(Vector2(-160.0, -10.0), Vector2(160.0, -10.0), COUNTER_DARK, 1.5)

	# Drawer pulls (3 small rects)
	for i in range(3):
		var px := -80.0 + float(i) * 80.0
		draw_rect(Rect2(px - 12.0, 0.0, 24.0, 10.0), COUNTER_DARK)
		draw_rect(Rect2(px - 9.0, 2.0, 18.0, 6.0), COUNTER_TOP)

	# Cash register on right side
	draw_rect(Rect2(100.0, -42.0, 50.0, 20.0), Color(0.2, 0.2, 0.22))  # register body
	draw_rect(Rect2(103.0, -50.0, 44.0, 10.0), Color(0.25, 0.25, 0.28))  # display top
	draw_rect(Rect2(106.0, -48.0, 38.0, 6.0), Color(0.1, 0.7, 0.3, 0.9))  # display screen
	# Register keys
	for ki in range(3):
		for kj in range(4):
			draw_rect(Rect2(103.0 + float(kj) * 10.0, -38.0 + float(ki) * 6.0, 7.0, 4.0),
				Color(0.35, 0.35, 0.38))

	# Flash overlay when billing
	if is_flashing:
		draw_rect(Rect2(-160.0, -50.0, 320.0, 77.0), flash_c)

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		player_here = true
		_try_bill()
	elif body.is_in_group("customers"):
		var c := body
		if c.get("state") == 4: # WAITING_AT_BILLING
			waiting_customers.append(c)
			if player_here:
				_try_bill()

func _on_body_exited(body: Node) -> void:
	if body.is_in_group("player"):
		player_here = false
	elif body.is_in_group("customers"):
		waiting_customers.erase(body)

func _try_bill() -> void:
	if waiting_customers.size() > 0 and player_here:
		var c = waiting_customers.pop_front()
		if c and is_instance_valid(c):
			c.get_billed()
			flash_timer = 0.4
			queue_redraw()
			_spawn_coin_popup(c.get("reward_coins") if c.get("reward_coins") else 15)

func _spawn_coin_popup(amount: int) -> void:
	var lbl := Label.new()
	lbl.text = "+" + str(amount) + " 🪙"
	lbl.position = global_position + Vector2(-25, -60)
	lbl.add_theme_color_override("font_color", Color(1, 0.85, 0))
	lbl.add_theme_font_size_override("font_size", 18)
	get_tree().current_scene.add_child(lbl)
	var tween := get_tree().create_tween()
	tween.tween_property(lbl, "position", lbl.position + Vector2(0, -65), 1.0)
	tween.parallel().tween_property(lbl, "modulate:a", 0.0, 1.0)
	tween.tween_callback(lbl.queue_free)
