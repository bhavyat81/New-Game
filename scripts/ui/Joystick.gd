extends Control

signal direction_changed(dir: Vector2)

var touching: bool = false
var touch_id: int = -1
var center: Vector2 = Vector2.ZERO
const RADIUS: float = 60.0

@onready var knob: ColorRect = $Knob

func _ready():
	center = size / 2.0

func _input(event):
	if event is InputEventScreenTouch:
		if event.pressed and _in_zone(event.position):
			touching = true
			touch_id = event.index
		elif not event.pressed and event.index == touch_id:
			touching = false
			touch_id = -1
			knob.position = center - knob.size / 2
			emit_signal("direction_changed", Vector2.ZERO)

	elif event is InputEventScreenDrag and event.index == touch_id and touching:
		var local = event.position - global_position - center
		var clamped = local.limit_length(RADIUS)
		knob.position = center + clamped - knob.size / 2
		emit_signal("direction_changed", clamped / RADIUS)

func _in_zone(pos: Vector2) -> bool:
	return (pos - (global_position + center)).length() < RADIUS * 2.0
