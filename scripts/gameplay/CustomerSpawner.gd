extends Node

var spawn_timer: float = 0.0
var spawn_interval: float = 6.0

const CUSTOMER_TYPES = [
	{"item": "nails", "reward": 10, "patience": 25.0, "color": Color(0.2, 0.6, 1.0)},
	{"item": "wire", "reward": 20, "patience": 18.0, "color": Color(1.0, 0.8, 0.0)},
]

var shelf_positions: Dictionary = {}
var billing_pos: Vector2 = Vector2(195, 500)
var exit_pos: Vector2 = Vector2(195, 820)
var entrance_pos: Vector2 = Vector2(195, 780)

func _process(delta):
	spawn_timer += delta
	if spawn_timer >= spawn_interval:
		spawn_timer = 0.0
		_spawn_customer()

func _spawn_customer():
	var type = CUSTOMER_TYPES[randi() % CUSTOMER_TYPES.size()]
	var shelf_pos = shelf_positions.get(type["item"], Vector2(100, 250))

	var customer = preload("res://scenes/gameplay/Customer.tscn").instantiate()
	customer.target_item = type["item"]
	customer.reward_coins = type["reward"]
	customer.max_patience = type["patience"]
	customer.shelf_position = shelf_pos
	customer.billing_position = billing_pos
	customer.exit_position = exit_pos
	customer.global_position = entrance_pos

	if customer.has_node("BodyRect"):
		customer.get_node("BodyRect").color = type["color"]

	get_parent().add_child(customer)
