/**
 * Mystery Shop modal.
 * Displays a rotating 4-item shop that refreshes every 4 hours.
 * Players spend coins or gems to claim deals; each bucket has a one-time
 * purchase limit per item.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { usePlayerStore } from '../store/playerStore';
import {
  getMysteryShopItems,
  getShopRefreshCountdown,
  formatCountdown,
  getCurrentBucketSeed,
  MysteryItem,
} from '../game/rewards/MysteryShop';
import { GameIcon } from './GameIcon';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { COLORS, RADII } from '../utils/constants';

interface MysteryShopModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MysteryShopModal: React.FC<MysteryShopModalProps> = ({
  visible,
  onClose,
}) => {
  const {
    coins,
    gems,
    spendCoins,
    spendGems,
    addCoins,
    addGems,
    addPowerUp,
    activateVIP,
    mysteryShopBucket,
    mysteryShopPurchases,
    recordMysteryPurchase,
  } = usePlayerStore();

  const [countdown, setCountdown] = useState(getShopRefreshCountdown());

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => setCountdown(getShopRefreshCountdown()), 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const currentBucket = getCurrentBucketSeed();
  const items = getMysteryShopItems();

  // Purchase history only counts for the current bucket
  const isCurrentBucket = mysteryShopBucket === currentBucket;
  const purchasedIds = isCurrentBucket ? mysteryShopPurchases : [];

  const handlePurchase = (item: MysteryItem) => {
    if (purchasedIds.includes(item.id)) return;
    const paid =
      item.currency === 'coins' ? spendCoins(item.cost) : spendGems(item.cost);
    if (!paid) return;

    if (item.reward.coins) addCoins(item.reward.coins);
    if (item.reward.gems) addGems(item.reward.gems);
    if (item.reward.bomb) addPowerUp('bomb', item.reward.bomb);
    if (item.reward.rowClear) addPowerUp('rowClear', item.reward.rowClear);
    if (item.reward.colorClear) addPowerUp('colorClear', item.reward.colorClear);
    if (item.reward.vipDurationMs) activateVIP(item.reward.vipDurationMs);
    recordMysteryPurchase(currentBucket, item.id);
  };

  return (
    <Modal visible={visible} onClose={onClose} dismissable>
      <Text style={styles.title}>Mystery Shop</Text>
      <Text style={styles.subtitle}>Rotates in {formatCountdown(countdown)}</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {items.map((item) => {
          const purchased = purchasedIds.includes(item.id);
          const affordable =
            item.currency === 'coins' ? coins >= item.cost : gems >= item.cost;
          return (
            <View
              key={item.id}
              style={[
                styles.card,
                { borderColor: item.color },
                purchased && styles.cardPurchased,
              ]}
            >
              {item.discount > 0 && (
                <View style={[styles.discountBadge, { backgroundColor: item.color }]}>
                  <Text style={styles.discountText}>-{item.discount}%</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <View style={[styles.iconCircle, { backgroundColor: `${item.color}20` }]}>
                  <GameIcon name={item.icon as any} size={22} color={item.color} />
                </View>
                <View style={styles.cardText}>
                  <Text style={[styles.cardName, { color: item.color }]}>{item.name}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
                <View style={styles.buyCol}>
                  {purchased ? (
                    <Text style={styles.purchasedLabel}>OWNED</Text>
                  ) : (
                    <Button
                      title={
                        item.currency === 'coins'
                          ? `${item.cost} coins`
                          : `${item.cost} gems`
                      }
                      onPress={() => handlePurchase(item)}
                      variant={affordable ? 'primary' : 'ghost'}
                      size="small"
                    />
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  scroll: {
    maxHeight: 400,
    width: '100%',
  },
  scrollContent: {
    gap: 10,
  },
  card: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADII.md,
    borderLeftWidth: 3,
    padding: 10,
    position: 'relative',
  },
  cardPurchased: {
    opacity: 0.55,
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  cardDesc: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  buyCol: {
    alignItems: 'flex-end',
  },
  purchasedLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.success,
    letterSpacing: 1,
  },
});
