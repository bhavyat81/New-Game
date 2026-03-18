extends CanvasLayer

@onready var coin_label: Label = $HUDPanel/HUDBar/CoinLabel
@onready var gem_label: Label = $HUDPanel/HUDBar/GemLabel
@onready var level_label: Label = $HUDPanel/HUDBar/LevelLabel
@onready var xp_bar: ProgressBar = $HUDPanel/HUDBar/XPBar

func _ready() -> void:
GameManager.connect("coins_changed", _on_coins)
GameManager.connect("xp_changed", _on_xp)
GameManager.connect("level_up", _on_level)
_refresh()

func _refresh() -> void:
_on_coins(GameManager.coins)
_on_xp(GameManager.xp)
_on_level(GameManager.level)
gem_label.text = "💎 " + str(GameManager.gems)

func _on_coins(v: int) -> void:
var display: String
if v >= 1000:
display = str(snappedf(v / 1000.0, 0.1)) + "K"
else:
display = str(v)
coin_label.text = "🪙 " + display

func _on_xp(v: int) -> void:
xp_bar.value = float(v) / float(GameManager.xp_to_next) * 100.0

func _on_level(v: int) -> void:
level_label.text = "⭐ Lv " + str(v)
