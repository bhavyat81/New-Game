import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useGameStore } from '../src/store/useGameStore';
import { startGameLoop, stopGameLoop } from '../src/game/gameLoop';
import { handleJoystickInput } from '../src/game/playerController';
import { getNextUnlockable } from '../src/game/inventorySystem';
import PlayerCharacter from '../src/components/PlayerCharacter';
import CustomerCharacter from '../src/components/CustomerCharacter';
import ShelfSection from '../src/components/ShelfSection';
import BillingCounter from '../src/components/BillingCounter';
import GodownRoom from '../src/components/GodownRoom';
import HUDBar from '../src/components/HUDBar';
import UnlockBanner from '../src/components/UnlockBanner';
import CoinPopup from '../src/components/CoinPopup';
import Joystick from '../src/components/Joystick';
import StoreFloor from '../src/components/StoreFloor';
import { ZONES } from '../src/constants/layout';
import { ItemType, ITEMS } from '../src/constants/items';

export default function GameScreen() {
  const {
    coins,
    gems,
    level,
    xp,
    xpToNextLevel,
    playerPosition,
    playerZone,
    carryingItems,
    shelves,
    customers,
    godownItems,
    pendingOrders,
    coinPopups,
    activeEvent,
    unlockShelf,
    restockShelf,
    placeRestockOrder,
    collectFromGodown,
    removeCoinPopup,
  } = useGameStore();

  const [joystickDir, setJoystickDir] = useState({ x: 0, y: 0 });
  const moveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startGameLoop();
    return () => stopGameLoop();
  }, []);

  // Continuous movement when joystick is held
  useEffect(() => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    if (joystickDir.x !== 0 || joystickDir.y !== 0) {
      moveIntervalRef.current = setInterval(() => {
        handleJoystickInput(joystickDir.x, joystickDir.y);
      }, 50);
    }
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
    };
  }, [joystickDir]);

  const handleJoystickMove = useCallback((dx: number, dy: number) => {
    setJoystickDir({ x: dx, y: dy });
  }, []);

  const handleJoystickRelease = useCallback(() => {
    setJoystickDir({ x: 0, y: 0 });
  }, []);

  const handleShelfTap = (shelfId: string) => {
    const shelf = shelves.find((s) => s.id === shelfId);
    if (!shelf) return;
    const canRestock = carryingItems.some((item) => item.type === shelf.itemType);
    if (canRestock) {
      restockShelf(shelfId);
    }
  };

  const canRestockShelf = (shelfId: string) => {
    const shelf = shelves.find((s) => s.id === shelfId);
    return shelf
      ? carryingItems.some((item) => item.type === shelf.itemType)
      : false;
  };

  const nextUnlock = getNextUnlockable();
  const showUnlockBanner = nextUnlock !== null && coins >= nextUnlock.cost * 0.5;

  const waitingAtBilling = customers.filter(
    (c) => c.state === 'waiting_at_billing'
  ).length;

  const totalCarrying = carryingItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HUD */}
      <HUDBar
        level={level}
        xp={xp}
        xpToNextLevel={xpToNextLevel}
        coins={coins}
        gems={gems}
        carryingCount={totalCarrying}
        activeEvent={activeEvent}
      />

      {/* Unlock Banner */}
      {showUnlockBanner && nextUnlock && (
        <UnlockBanner
          shelfName={nextUnlock.name}
          cost={nextUnlock.cost}
          currentCoins={coins}
          onUnlock={() => unlockShelf(nextUnlock.id)}
        />
      )}

      {/* Store View */}
      <View style={styles.storeContainer}>
        {/* Floor */}
        <StoreFloor />

        {/* Road / Outdoor at top */}
        <View style={styles.outdoor}>
          <Text style={styles.outdoorText}>🌿 Road 🌿</Text>
        </View>

        {/* Entrance */}
        <View style={[styles.entrance, { left: ZONES.entrance.x, top: ZONES.entrance.y }]}>
          <Text style={styles.entranceText}>🚪 ENTRANCE</Text>
        </View>

        {/* Shelves Row 1 (top) */}
        <View style={[styles.shelfWrapper, { left: ZONES.shelf_pipes.x, top: ZONES.shelf_pipes.y }]}>
          <ShelfSection
            shelf={shelves.find((s) => s.id === 'shelf_pipes')!}
            onTap={handleShelfTap}
            canRestock={canRestockShelf('shelf_pipes')}
          />
        </View>
        <View style={[styles.shelfWrapper, { left: ZONES.shelf_paint.x, top: ZONES.shelf_paint.y }]}>
          <ShelfSection
            shelf={shelves.find((s) => s.id === 'shelf_paint')!}
            onTap={handleShelfTap}
            canRestock={canRestockShelf('shelf_paint')}
          />
        </View>

        {/* Shelves Row 2 */}
        <View style={[styles.shelfWrapper, { left: ZONES.shelf_nails.x, top: ZONES.shelf_nails.y }]}>
          <ShelfSection
            shelf={shelves.find((s) => s.id === 'shelf_nails')!}
            onTap={handleShelfTap}
            canRestock={canRestockShelf('shelf_nails')}
          />
        </View>
        <View style={[styles.shelfWrapper, { left: ZONES.shelf_wire.x, top: ZONES.shelf_wire.y }]}>
          <ShelfSection
            shelf={shelves.find((s) => s.id === 'shelf_wire')!}
            onTap={handleShelfTap}
            canRestock={canRestockShelf('shelf_wire')}
          />
        </View>

        {/* Shelves Row 3 */}
        <View style={[styles.shelfWrapper, { left: ZONES.shelf_nuts.x, top: ZONES.shelf_nuts.y }]}>
          <ShelfSection
            shelf={shelves.find((s) => s.id === 'shelf_nuts')!}
            onTap={handleShelfTap}
            canRestock={canRestockShelf('shelf_nuts')}
          />
        </View>
        <View style={[styles.shelfWrapper, { left: ZONES.shelf_cement.x, top: ZONES.shelf_cement.y }]}>
          <ShelfSection
            shelf={shelves.find((s) => s.id === 'shelf_cement')!}
            onTap={handleShelfTap}
            canRestock={canRestockShelf('shelf_cement')}
          />
        </View>

        {/* Billing Counter */}
        <View style={[styles.billingWrapper, { left: ZONES.billing.x, top: ZONES.billing.y }]}>
          <BillingCounter
            isPlayerHere={playerZone === 'billing'}
            waitingCount={waitingAtBilling}
          />
        </View>

        {/* Godown */}
        <View style={[styles.godownWrapper, { left: ZONES.godown.x, top: ZONES.godown.y }]}>
          <GodownRoom
            godownItems={godownItems}
            pendingOrders={pendingOrders}
            onCollect={(type) => collectFromGodown(type as ItemType)}
            onOrder={(type) => placeRestockOrder(type)}
            isPlayerHere={playerZone === 'godown'}
            shelves={shelves}
          />
        </View>

        {/* Customers */}
        {customers.map((customer) => (
          <CustomerCharacter key={customer.id} customer={customer} />
        ))}

        {/* Player */}
        <PlayerCharacter
          x={playerPosition.x}
          y={playerPosition.y}
          direction={joystickDir}
        />

        {/* Coin Popups */}
        {coinPopups.map((popup) => (
          <CoinPopup
            key={popup.id}
            amount={popup.amount}
            x={popup.x}
            y={popup.y}
            onComplete={() => removeCoinPopup(popup.id)}
          />
        ))}
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Joystick */}
        <Joystick onMove={handleJoystickMove} onRelease={handleJoystickRelease} />

        {/* Status Info */}
        <View style={styles.statusInfo}>
          {waitingAtBilling > 0 && (
            <View style={styles.billingAlert}>
              <Text style={styles.billingAlertText}>
                💰 {waitingAtBilling} customer{waitingAtBilling > 1 ? 's' : ''} at billing!
              </Text>
            </View>
          )}
          {totalCarrying > 0 && (
            <View style={styles.carryingInfo}>
              <Text style={styles.carryingText}>
                📦 {carryingItems.map((i) => `${ITEMS[i.type].emoji}×${i.quantity}`).join(' ')}
              </Text>
            </View>
          )}
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>🏠</Text>
        </TouchableOpacity>
      </View>

      {/* Zone Indicator */}
      <View style={styles.zoneIndicator}>
        <Text style={styles.zoneText}>📍 {playerZone}</Text>
        {totalCarrying > 0 && (
          <Text style={styles.carryText}>
            Carrying: {carryingItems.map((i) => `${i.type}(${i.quantity})`).join(', ')}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  storeContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#F5E6C8',
  },
  outdoor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  outdoorText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  entrance: {
    position: 'absolute',
    width: 100,
    height: 36,
    backgroundColor: '#795548',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    zIndex: 5,
  },
  entranceText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  shelfWrapper: {
    position: 'absolute',
    zIndex: 10,
  },
  billingWrapper: {
    position: 'absolute',
    width: 200,
    zIndex: 10,
  },
  godownWrapper: {
    position: 'absolute',
    width: 360,
    zIndex: 10,
  },
  bottomControls: {
    height: 130,
    backgroundColor: 'rgba(0,0,0,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  statusInfo: {
    flex: 1,
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billingAlert: {
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  billingAlertText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  carryingInfo: {
    backgroundColor: '#FF8C00',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  carryingText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#333',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
  },
  zoneIndicator: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  zoneText: {
    color: '#4CAF50',
    fontSize: 10,
  },
  carryText: {
    color: '#FFC107',
    fontSize: 9,
  },
});
