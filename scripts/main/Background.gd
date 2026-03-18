extends Node2D

func _draw() -> void:
	var W := 480.0

	# == STREET / OUTSIDE (y: 0-80) ==
	draw_rect(Rect2(0.0, 0.0, W, 80.0), Color(0.52, 0.52, 0.50))
	# Lane markings (yellow dashes)
	for i in range(0, int(W), 50):
		draw_rect(Rect2(float(i), 32.0, 26.0, 12.0), Color(0.94, 0.87, 0.1, 0.85))
	# Footpath strip
	draw_rect(Rect2(0.0, 66.0, W, 16.0), Color(0.68, 0.65, 0.58))
	draw_line(Vector2(0.0, 66.0), Vector2(W, 66.0), Color(0.5, 0.47, 0.40), 2.0)

	# == WALL STRIPE (y: 80-100) ==
	draw_rect(Rect2(0.0, 80.0, W, 20.0), Color(0.72, 0.16, 0.16))
	for x in range(0, int(W), 30):
		draw_line(Vector2(float(x), 80.0), Vector2(float(x), 100.0), Color(0.55, 0.08, 0.08, 0.5), 1.5)

	# == SHOP FLOOR TILES (y: 100-580) ==
	var tile := 40
	for row in range(13):
		for col in range(12):
			var tx := float(col * tile)
			var ty := 100.0 + float(row * tile)
			if ty >= 580.0:
				continue
			var light := (row + col) % 2 == 0
			var c := Color(0.95, 0.88, 0.74) if light else Color(0.87, 0.79, 0.63)
			draw_rect(Rect2(tx, ty, float(tile), float(tile)), c)
	# Grout lines
	for col in range(13):
		draw_line(Vector2(float(col * tile), 100.0), Vector2(float(col * tile), 580.0),
				  Color(0.70, 0.62, 0.50, 0.5), 1.0)
	for row in range(13):
		var ly := 100.0 + float(row * tile)
		if ly <= 580.0:
			draw_line(Vector2(0.0, ly), Vector2(W, ly), Color(0.70, 0.62, 0.50, 0.5), 1.0)

	# == DIVIDER BAR (y: 578-586) ==
	draw_rect(Rect2(0.0, 578.0, W, 8.0), Color(0.42, 0.24, 0.08))
	for x in range(0, int(W), 22):
		draw_rect(Rect2(float(x), 578.0, 11.0, 8.0), Color(0.58, 0.36, 0.14))

	# == GODOWN FLOOR (y: 586-854) ==
	for row in range(8):
		for col in range(12):
			var tx := float(col * tile)
			var ty := 586.0 + float(row * tile)
			var dark := (row + col) % 2 == 0
			var c := Color(0.19, 0.13, 0.06) if dark else Color(0.26, 0.19, 0.10)
			draw_rect(Rect2(tx, ty, float(tile), float(tile)), c)

	# == SHOP SIGNBOARD (y: 6-74) ==
	# Outer frame
	draw_rect(Rect2(22.0, 6.0, 436.0, 68.0), Color(0.45, 0.07, 0.07))
	# Inner fill (cream)
	draw_rect(Rect2(26.0, 10.0, 428.0, 60.0), Color(0.99, 0.93, 0.82))
	# Decorative inner border
	draw_rect(Rect2(30.0, 14.0, 420.0, 52.0), Color(0.45, 0.07, 0.07), false, 2.0)
	draw_rect(Rect2(34.0, 18.0, 412.0, 44.0), Color(0.75, 0.22, 0.12), false, 1.5)
	# Corner decorations
	for cx in [38.0, 442.0]:
		for cy in [22.0, 58.0]:
			draw_circle(Vector2(cx, cy), 5.0, Color(0.75, 0.22, 0.12))
			draw_circle(Vector2(cx, cy), 3.0, Color(0.99, 0.93, 0.82))
