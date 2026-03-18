extends Control

signal direction_changed(dir: Vector2)

var touching: bool = false
var touch_id: int = -1
var center: Vector2 = Vector2.ZERO
var knob_pos: Vector2 = Vector2.ZERO
const RADIUS: float = 60.0
const KNOB_RADIUS: float = 22.0

func _ready() -> void:
center = size / 2.0
knob_pos = center
queue_redraw()

func _draw() -> void:
# Outer base ring (semi-transparent)
draw_circle(center, RADIUS, Color(0.75, 0.82, 1.0, 0.12))
draw_arc(center, RADIUS, 0.0, TAU, 48, Color(1.0, 1.0, 1.0, 0.40), 2.5, true)
# Inner guide ring
draw_arc(center, RADIUS * 0.55, 0.0, TAU, 32, Color(1.0, 1.0, 1.0, 0.18), 1.5, true)

# Knob shadow
draw_circle(knob_pos + Vector2(2.0, 3.0), KNOB_RADIUS, Color(0.0, 0.0, 0.0, 0.20))
# Knob fill
draw_circle(knob_pos, KNOB_RADIUS, Color(0.85, 0.90, 1.0, 0.72))
# Knob border
draw_arc(knob_pos, KNOB_RADIUS, 0.0, TAU, 32, Color(1.0, 1.0, 1.0, 0.90), 2.0, true)
# Knob highlight
draw_circle(knob_pos + Vector2(-4.0, -5.0), 6.0, Color(1.0, 1.0, 1.0, 0.30))

func _input(event: InputEvent) -> void:
if event is InputEventScreenTouch:
if event.pressed and _in_zone(event.position):
touching = true
touch_id = event.index
elif not event.pressed and event.index == touch_id:
touching = false
touch_id = -1
knob_pos = center
queue_redraw()
emit_signal("direction_changed", Vector2.ZERO)

elif event is InputEventScreenDrag and event.index == touch_id and touching:
var local := event.position - global_position - center
var clamped := local.limit_length(RADIUS)
knob_pos = center + clamped
queue_redraw()
emit_signal("direction_changed", clamped / RADIUS)

func _in_zone(pos: Vector2) -> bool:
return (pos - (global_position + center)).length() < RADIUS * 2.0
