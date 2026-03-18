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

var state: State = State.ENTERING
var patience: float = 0.0
var target_pos: Vector2 = Vector2.ZERO
var has_item: bool = false

@onready var patience_bar: ProgressBar = $PatienceBar
@onready var body_rect: ColorRect = $BodyRect

func _ready():
	patience = max_patience
	target_pos = shelf_position
	state = State.WALKING_TO_SHELF
	add_to_group("customers")

func _physics_process(delta):
	match state:
		State.WALKING_TO_SHELF, State.WALKING_TO_BILLING, State.EXITING, State.ANGRY_EXIT:
			_move_toward(target_pos)
		State.WAITING_AT_SHELF, State.WAITING_AT_BILLING:
			patience -= delta
			if patience_bar:
				patience_bar.value = (patience / max_patience) * 100.0
			if patience <= 0:
				_go_angry()

func _move_toward(dest: Vector2):
	var dir = dest - global_position
	if dir.length() < 8.0:
		_on_reached()
		return
	velocity = dir.normalized() * move_speed
	move_and_slide()

func _on_reached():
	match state:
		State.WALKING_TO_SHELF:
			state = State.WAITING_AT_SHELF
		State.WALKING_TO_BILLING:
			state = State.WAITING_AT_BILLING
		State.EXITING, State.ANGRY_EXIT:
			queue_free()

func pick_item():
	has_item = true
	state = State.WALKING_TO_BILLING
	target_pos = billing_position

func get_billed():
	GameManager.add_coins(reward_coins)
	GameManager.add_xp(reward_xp)
	EventBus.emit_signal("customer_billed", name, reward_coins)
	state = State.EXITING
	target_pos = exit_position

func _go_angry():
	state = State.ANGRY_EXIT
	target_pos = exit_position
	if body_rect:
		body_rect.color = Color(1, 0, 0)
	EventBus.emit_signal("customer_angry_exit", name)
