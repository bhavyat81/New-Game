extends Area2D

var player_here: bool = false
var waiting_customers: Array = []

func _ready():
	connect("body_entered", _on_body_entered)
	connect("body_exited", _on_body_exited)

func _on_body_entered(body):
	if body.is_in_group("player"):
		player_here = true
		_try_bill()
	elif body.is_in_group("customers"):
		var c = body
		if c.get("state") == 4: # WAITING_AT_BILLING
			waiting_customers.append(c)
			if player_here:
				_try_bill()

func _on_body_exited(body):
	if body.is_in_group("player"):
		player_here = false
	elif body.is_in_group("customers"):
		waiting_customers.erase(body)

func _try_bill():
	if waiting_customers.size() > 0 and player_here:
		var c = waiting_customers.pop_front()
		if c and is_instance_valid(c):
			c.get_billed()
			_spawn_coin_popup(c.get("reward_coins") if c.get("reward_coins") else 15)

func _spawn_coin_popup(amount: int):
	var lbl = Label.new()
	lbl.text = "+" + str(amount) + " 💰"
	lbl.position = global_position + Vector2(-20, -50)
	lbl.add_theme_color_override("font_color", Color(1, 0.85, 0))
	get_tree().current_scene.add_child(lbl)
	var tween = get_tree().create_tween()
	tween.tween_property(lbl, "position", lbl.position + Vector2(0, -60), 1.0)
	tween.parallel().tween_property(lbl, "modulate:a", 0.0, 1.0)
	tween.tween_callback(lbl.queue_free)
