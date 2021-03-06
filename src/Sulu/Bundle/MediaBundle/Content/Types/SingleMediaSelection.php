<?php

/*
 * This file is part of Sulu.
 *
 * (c) Sulu GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\MediaBundle\Content\Types;

use Sulu\Bundle\MediaBundle\Admin\MediaAdmin;
use Sulu\Bundle\MediaBundle\Api\Media;
use Sulu\Bundle\MediaBundle\Entity\Collection;
use Sulu\Bundle\MediaBundle\Media\Exception\MediaNotFoundException;
use Sulu\Bundle\MediaBundle\Media\Manager\MediaManagerInterface;
use Sulu\Bundle\WebsiteBundle\ReferenceStore\ReferenceStoreInterface;
use Sulu\Component\Content\Compat\PropertyInterface;
use Sulu\Component\Content\PreResolvableContentTypeInterface;
use Sulu\Component\Content\SimpleContentType;
use Sulu\Component\Security\Authorization\PermissionTypes;
use Sulu\Component\Security\Authorization\SecurityCheckerInterface;
use Sulu\Component\Security\Authorization\SecurityCondition;

class SingleMediaSelection extends SimpleContentType implements PreResolvableContentTypeInterface
{
    /**
     * @var MediaManagerInterface
     */
    private $mediaManager;

    /**
     * @var ReferenceStoreInterface
     */
    private $mediaReferenceStore;

    /**
     * @var ?SecurityCheckerInterface
     */
    private $securityChecker;

    public function __construct(
        MediaManagerInterface $mediaManager,
        ReferenceStoreInterface $referenceStore,
        SecurityCheckerInterface $securityChecker = null
    ) {
        $this->mediaManager = $mediaManager;
        $this->mediaReferenceStore = $referenceStore;
        $this->securityChecker = $securityChecker;

        parent::__construct('SingleMediaSelection', '{"id": null}');
    }

    public function getContentData(PropertyInterface $property): ?Media
    {
        $data = $property->getValue();
        if (!isset($data['id'])) {
            return null;
        }

        try {
            $entity = $this->mediaManager->getById($data['id'], $property->getStructure()->getLanguageCode());
        } catch (MediaNotFoundException $e) {
            return null;
        }

        if ($this->securityChecker
            && !$this->securityChecker->hasPermission(
                new SecurityCondition(
                    MediaAdmin::SECURITY_CONTEXT,
                    $property->getStructure()->getLanguageCode(),
                    Collection::class,
                    $entity->getCollection()
                ),
                PermissionTypes::VIEW
            )
        ) {
            return null;
        }

        return $entity;
    }

    public function getViewData(PropertyInterface $property)
    {
        return $property->getValue();
    }

    public function preResolve(PropertyInterface $property)
    {
        $data = $property->getValue();
        if (!isset($data['id'])) {
            return;
        }

        $this->mediaReferenceStore->add($data['id']);
    }

    protected function encodeValue($value)
    {
        return \json_encode($value);
    }

    protected function decodeValue($value)
    {
        if (!\is_string($value)) {
            return null;
        }

        return \json_decode($value, true);
    }
}
