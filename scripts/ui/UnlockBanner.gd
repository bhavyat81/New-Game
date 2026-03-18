extends CanvasLayer

@onready var banner: PanelContainer = $Banner
@onready var banner_label: Label = $Banner/Label

func _ready():
	banner.visible = false
	EventBus.connect("show_unlock_banner", _show)
	EventBus.connect("hide_unlock_banner", _hide)

func _show(shelf_id: String):
	banner_label.text = "💡 Unlock " + shelf_id.capitalize() + " Shelf!"
	banner.visible = true

func _hide():
	banner.visible = false
