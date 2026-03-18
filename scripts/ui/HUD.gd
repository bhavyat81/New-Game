extends CanvasLayer

@onready var coin_label: Label = $HUDBar/CoinLabel
@onready var gem_label: Label = $HUDBar/GemLabel
@onready var level_label: Label = $HUDBar/LevelLabel
@onready var xp_bar: ProgressBar = $HUDBar/XPBar

func _ready():
	GameManager.connect("coins_changed", _on_coins)
	GameManager.connect("xp_changed", _on_xp)
	GameManager.connect("level_up", _on_level)
	_refresh()

func _refresh():
	_on_coins(GameManager.coins)
	_on_xp(GameManager.xp)
	_on_level(GameManager.level)

func _on_coins(v: int):
	coin_label.text = (str(snappedf(v / 1000.0, 0.1)) + "K") if v >= 1000 else str(v)

func _on_xp(v: int):
	xp_bar.value = float(v) / float(GameManager.xp_to_next) * 100.0

func _on_level(v: int):
	level_label.text = "Lv " + str(v)
