extends Node

signal customer_billed(customer_id, amount)
signal shelf_restocked(shelf_id)
signal order_placed(item_type)
signal order_arrived(item_type)
signal show_unlock_banner(shelf_id)
signal hide_unlock_banner()
signal customer_angry_exit(customer_id)
signal customer_at_shelf(customer, item_type)
