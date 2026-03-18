extends CharacterBody2D

enum State { ENTERING, WALKING_TO_SHELF, WAITING_AT_SHELF, WALKING_TO_BILLING, WAITING_AT_BILLING, EXITING, ANGRY_EXIT }

@export var move_speed: float = 80.0
@export var max_patience: float = 20.0
@export var reward_coins: int = 15
@export var reward_xp: int = 10
@export var target_item: String = "nails"
@export var shelf_position: Vector2 = Vector2(100, 200)
@export var billing_position: Vector2 = Vector2(195, 500)
@export var exit_position: Vector2 = Vector2(195, 780)
@export var body_color: Color = Color(0.2, 0.6, 1.0)

const ITEM_EMOJIS := {
"nails": "🔩", "wire": "⚡", "paint": "🎨",
"pipes": "🔧", "nuts": "🥜", "cement": "🧱"
}

var state: State = State.ENTERING
var patience: float = 0.0
var target_pos: Vector2 = Vector2.ZERO
var has_item: bool = false
var is_angry: bool = false

# Cached StyleBoxFlat — created once in _ready(), reused every frame
var _fill_style: StyleBoxFlat = null

@onready var patience_bar: ProgressBar = $PatienceBar
@onready var speech_label: Label = $SpeechLabel

func _ready() -> void:
patience = max_patience
target_pos = shelf_position
state = State.WALKING_TO_SHELF
add_to_group("customers")
if speech_label:
speech_label.text = ITEM_EMOJIS.get(target_item, "❓")

# Create fill style once and cache it
_fill_style = StyleBoxFlat.new()
_fill_style.bg_color = Color(0.15, 0.82, 0.15)
_fill_style.corner_radius_top_left = 4
_fill_style.corner_radius_top_right = 4
_fill_style.corner_radius_bottom_left = 4
_fill_style.corner_radius_bottom_right = 4

# Background style — static, created once
var bg_style := StyleBoxFlat.new()
bg_style.bg_color = Color(0.15, 0.15, 0.15, 0.70)
bg_style.corner_radius_top_left = 4
bg_style.corner_radius_top_right = 4
bg_style.corner_radius_bottom_left = 4
bg_style.corner_radius_bottom_right = 4

if patience_bar:
patience_bar.add_theme_stylebox_override("fill", _fill_style)
patience_bar.add_theme_stylebox_override("background", bg_style)

queue_redraw()

func _physics_process(delta: float) -> void:
match state:
State.WALKING_TO_SHELF, State.WALKING_TO_BILLING, State.EXITING, State.ANGRY_EXIT:
_move_toward(target_pos)
State.WAITING_AT_SHELF, State.WAITING_AT_BILLING:
patience -= delta
if patience_bar:
patience_bar.value = (patience / max_patience) * 100.0
_update_patience_color()
if patience <= 0:
_go_angry()

func _update_patience_color() -> void:
if _fill_style == null:
return
var ratio := patience / max_patience
if ratio > 0.6:
_fill_style.bg_color = Color(0.15, 0.82, 0.15)
elif ratio > 0.3:
_fill_style.bg_color = Color(0.95, 0.78, 0.05)
else:
_fill_style.bg_color = Color(0.95, 0.15, 0.10)

func _draw() -> void:
var c := body_color
if is_angry:
c = Color(0.92, 0.15, 0.10)

# Drop shadow
draw_circle(Vector2(0.0, 22.0), 14.0, Color(0.0, 0.0, 0.0, 0.08))

# Legs
draw_rect(Rect2(-8.0, 9.0, 7.0, 16.0), c.darkened(0.35))
draw_rect(Rect2(2.0, 9.0, 7.0, 16.0), c.darkened(0.35))

# Body
draw_rect(Rect2(-12.0, -15.0, 24.0, 26.0), c)

# Arms (skin tone)
draw_rect(Rect2(-19.0, -14.0, 7.0, 18.0), Color(0.90, 0.72, 0.54))
draw_rect(Rect2(13.0, -14.0, 7.0, 18.0), Color(0.90, 0.72, 0.54))

# Neck
draw_rect(Rect2(-3.0, -18.0, 6.0, 5.0), Color(0.90, 0.72, 0.54))

# Head
draw_circle(Vector2(0.0, -26.0), 11.0, Color(0.91, 0.73, 0.54))

# Hair
draw_circle(Vector2(0.0, -34.0), 9.0, Color(0.10, 0.07, 0.05))
draw_rect(Rect2(-9.0, -34.0, 18.0, 9.0), Color(0.10, 0.07, 0.05))

# Eyes
draw_circle(Vector2(-4.0, -28.0), 2.0, Color(0.08, 0.08, 0.08))
draw_circle(Vector2(4.0, -28.0), 2.0, Color(0.08, 0.08, 0.08))
draw_circle(Vector2(-3.2, -28.8), 0.8, Color(1.0, 1.0, 1.0, 0.7))
draw_circle(Vector2(4.8, -28.8), 0.8, Color(1.0, 1.0, 1.0, 0.7))

if is_angry:
# Angry eyebrows
draw_line(Vector2(-7.0, -34.0), Vector2(-2.0, -31.5), Color(0.08, 0.08, 0.08), 2.0)
draw_line(Vector2(7.0, -34.0), Vector2(2.0, -31.5), Color(0.08, 0.08, 0.08), 2.0)
# Frown
draw_circle(Vector2(-3.0, -22.5), 1.5, Color(0.55, 0.1, 0.1))
draw_circle(Vector2(3.0, -22.5), 1.5, Color(0.55, 0.1, 0.1))

func _move_toward(dest: Vector2) -> void:
var dir := dest - global_position
if dir.length() < 8.0:
_on_reached()
return
velocity = dir.normalized() * move_speed
move_and_slide()

func _on_reached() -> void:
match state:
State.WALKING_TO_SHELF:
state = State.WAITING_AT_SHELF
State.WALKING_TO_BILLING:
state = State.WAITING_AT_BILLING
State.EXITING, State.ANGRY_EXIT:
queue_free()

func pick_item() -> void:
has_item = true
state = State.WALKING_TO_BILLING
target_pos = billing_position
if speech_label:
speech_label.text = "✅"

func get_billed() -> void:
GameManager.add_coins(reward_coins)
GameManager.add_xp(reward_xp)
EventBus.emit_signal("customer_billed", name, reward_coins)
state = State.EXITING
target_pos = exit_position
if speech_label:
speech_label.text = "😊"

func _go_angry() -> void:
is_angry = true
state = State.ANGRY_EXIT
target_pos = exit_position
queue_redraw()
if speech_label:
speech_label.text = "😡"
EventBus.emit_signal("customer_angry_exit", name)
