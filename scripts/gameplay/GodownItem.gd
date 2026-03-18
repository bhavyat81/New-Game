extends Area2D

@export var item_type: String = "nails"

func _ready():
	connect("body_entered", _on_body_entered)

func _on_body_entered(body):
	if body.is_in_group("player"):
		body.collect_item(item_type)
		queue_free()
