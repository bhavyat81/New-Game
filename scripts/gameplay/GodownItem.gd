extends Area2D

@export var item_type: String = "nails"

const ITEM_EMOJIS := {
"nails": "🔩", "wire": "⚡", "paint": "🎨",
"pipes": "🔧", "nuts": "🥜", "cement": "🧱"
}
const ITEM_COLORS := {
"nails": Color(0.70, 0.70, 0.75),
"wire":  Color(0.90, 0.80, 0.10),
"paint": Color(0.30, 0.60, 0.90),
"pipes": Color(0.70, 0.40, 0.20),
"nuts":  Color(0.80, 0.70, 0.30),
"cement": Color(0.70, 0.70, 0.68),
}

func _ready() -> void:
connect("body_entered", _on_body_entered)
if has_node("EmojiLabel"):
$EmojiLabel.text = ITEM_EMOJIS.get(item_type, "📦")
queue_redraw()

func _draw() -> void:
var c := ITEM_COLORS.get(item_type, Color(0.7, 0.7, 0.7))
# Mini crate box
draw_rect(Rect2(-12.0, -12.0, 24.0, 24.0), Color(0.52, 0.36, 0.12))
draw_line(Vector2(-12.0, -12.0), Vector2(12.0, 12.0), Color(0.30, 0.18, 0.05), 1.0)
draw_line(Vector2(12.0, -12.0), Vector2(-12.0, 12.0), Color(0.30, 0.18, 0.05), 1.0)
draw_rect(Rect2(-12.0, -12.0, 24.0, 24.0), Color(0.70, 0.54, 0.24), false, 1.5)
# Item color indicator dot
draw_circle(Vector2(0.0, 0.0), 6.0, c)

func _on_body_entered(body: Node) -> void:
if body.is_in_group("player"):
body.collect_item(item_type)
queue_free()
