extends Node2D

@onready var player = $Player
@onready var joystick = $JoystickLayer/Joystick
@onready var spawner = $CustomerSpawner

func _ready():
	GameManager.load_game()
	joystick.direction_changed.connect(player.set_joystick_input)
	# Tell spawner where shelves are
	spawner.shelf_positions = {
		"nails": $NailsShelf.global_position,
		"wire": $WireShelf.global_position,
	}
	spawner.billing_pos = $BillingCounter.global_position
	spawner.exit_pos = Vector2(195, 820)
	spawner.entrance_pos = Vector2(195, 820)

func _notification(what):
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		GameManager.save_game()
