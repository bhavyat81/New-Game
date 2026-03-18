extends Node2D

@onready var player: CharacterBody2D = $Player
@onready var spawner: Node = $CustomerSpawner

func _ready():
	GameManager.load_game()

	# Connect joystick to player
	var joystick = $JoystickLayer/Joystick
	if joystick and joystick.has_signal("direction_changed"):
		joystick.direction_changed.connect(player.set_joystick_input)

	# Tell spawner where shelves and counters are
	spawner.shelf_positions = {
		"nails": $NailsShelf.global_position,
		"wire": $WireShelf.global_position,
		"paint": $PaintShelf.global_position,
		"pipes": $PipesShelf.global_position,
	}
	spawner.billing_pos = $BillingCounter.global_position
	spawner.exit_pos = Vector2(195, 820)
	spawner.entrance_pos = Vector2(195, 820)

func _notification(what):
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		GameManager.save_game()